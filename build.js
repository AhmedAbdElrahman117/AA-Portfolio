/* ====================================
   Build Script - Minification & Obfuscation
   ==================================== */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Configuration
const isProduction = process.argv.includes('--production');

// Output directories
const OUTPUT_DIR = 'dist';
const JS_OUTPUT = path.join(OUTPUT_DIR, 'js');
const DASHBOARD_JS_OUTPUT = path.join(OUTPUT_DIR, 'dashboard', 'js');

// Obfuscator options (balanced security vs performance)
const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.2,
    debugProtection: isProduction,
    debugProtectionInterval: isProduction ? 4000 : 0,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Files to obfuscate
const filesToObfuscate = [
    // Config file (contains keys)
    { input: 'config.js', output: path.join(JS_OUTPUT, 'config.min.js') },
    
    // Main portfolio files
    { input: 'js/main.js', output: path.join(JS_OUTPUT, 'main.min.js') },
    { input: 'js/data.js', output: path.join(JS_OUTPUT, 'data.min.js') },
    
    // Dashboard files
    { input: 'dashboard/js/dashboard.js', output: path.join(DASHBOARD_JS_OUTPUT, 'dashboard.min.js') },
    { input: 'dashboard/js/auth.js', output: path.join(DASHBOARD_JS_OUTPUT, 'auth.min.js') },
    { input: 'dashboard/js/upload-service.js', output: path.join(DASHBOARD_JS_OUTPUT, 'upload-service.min.js') },
    { input: 'dashboard/js/analytics.js', output: path.join(DASHBOARD_JS_OUTPUT, 'analytics.min.js') }
];

// Create output directories
function createOutputDirs() {
    [OUTPUT_DIR, JS_OUTPUT, DASHBOARD_JS_OUTPUT].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Obfuscate a single file
function obfuscateFile(inputPath, outputPath) {
    try {
        console.log(`Processing: ${inputPath}`);
        
        // Read source file
        const sourceCode = fs.readFileSync(inputPath, 'utf8');
        
        // Obfuscate
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, obfuscatorOptions);
        
        // Write output
        fs.writeFileSync(outputPath, obfuscatedCode.getObfuscatedCode());
        
        const originalSize = (sourceCode.length / 1024).toFixed(2);
        const obfuscatedSize = (obfuscatedCode.getObfuscatedCode().length / 1024).toFixed(2);
        console.log(`  ✓ ${inputPath} -> ${outputPath}`);
        console.log(`    Size: ${originalSize}KB -> ${obfuscatedSize}KB`);
        
        return true;
    } catch (error) {
        console.error(`  ✗ Error processing ${inputPath}:`, error.message);
        return false;
    }
}

// Copy HTML files and update script references
function copyHTMLFiles() {
    console.log('\nCopying HTML files...');
    
    // Copy and update index.html
    let indexHTML = fs.readFileSync('index.html', 'utf8');
    indexHTML = indexHTML
        .replace(/js\/data\.js\?v=\d+/g, 'dist/js/data.min.js?v=7')
        .replace(/js\/main\.js\?v=\d+/g, 'dist/js/main.min.js?v=7')
        .replace(/<\/head>/i, '    <script src="dist/js/config.min.js?v=7"></script>\n</head>');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
    console.log('  ✓ index.html');
    
    // Copy and update dashboard/index.html
    if (!fs.existsSync(path.join(OUTPUT_DIR, 'dashboard'))) {
        fs.mkdirSync(path.join(OUTPUT_DIR, 'dashboard'), { recursive: true });
    }
    
    let dashboardHTML = fs.readFileSync('dashboard/index.html', 'utf8');
    dashboardHTML = dashboardHTML
        .replace(/js\/auth\.js/g, '../dist/dashboard/js/auth.min.js?v=7')
        .replace(/js\/upload-service\.js/g, '../dist/dashboard/js/upload-service.min.js?v=7')
        .replace(/js\/dashboard\.js/g, '../dist/dashboard/js/dashboard.min.js?v=7')
        .replace(/js\/analytics\.js/g, '../dist/dashboard/js/analytics.min.js?v=7')
        .replace(/<\/head>/i, '    <script src="../dist/js/config.min.js?v=7"></script>\n</head>');
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'dashboard', 'index.html'), dashboardHTML);
    console.log('  ✓ dashboard/index.html');
}

// Main build function
function build() {
    console.log('==========================================');
    console.log('  JS Minification & Obfuscation Build');
    console.log('==========================================\n');
    console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}\n`);
    
    // Create directories
    console.log('Creating output directories...');
    createOutputDirs();
    console.log('  ✓ Output directories created\n');
    
    // Obfuscate files
    console.log('Obfuscating JavaScript files...\n');
    let successCount = 0;
    let failCount = 0;
    
    filesToObfuscate.forEach(file => {
        if (obfuscateFile(file.input, file.output)) {
            successCount++;
        } else {
            failCount++;
        }
        console.log('');
    });
    
    // Copy HTML files
    copyHTMLFiles();
    
    // Summary
    console.log('\n==========================================');
    console.log('  Build Summary');
    console.log('==========================================');
    console.log(`✓ Successfully obfuscated: ${successCount} files`);
    if (failCount > 0) {
        console.log(`✗ Failed: ${failCount} files`);
    }
    console.log(`\nOutput directory: ${OUTPUT_DIR}/`);
    console.log('\n⚠️  SECURITY NOTES:');
    console.log('  1. Obfuscation is NOT encryption - keys are still recoverable');
    console.log('  2. Use Firebase Security Rules to protect your data');
    console.log('  3. Never expose API secrets (like Cloudinary secret) in client code');
    console.log('  4. Consider implementing backend authentication');
    console.log('\n✓ Build complete!\n');
}

// Run build
build();
