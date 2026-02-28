import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { initFirebase } from '../../../lib/firebase';
import Swal from 'sweetalert2';

export default function ContactManager() {
    const [contact, setContact] = useState({ address: '', phone: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadContact();
    }, []);

    const loadContact = async () => {
        const { db } = initFirebase();
        if (!db) return;

        try {
            const docRef = doc(db, "portfolio", "contact");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fsData = docSnap.data().data || docSnap.data();
                setContact({
                    address: fsData.address || '',
                    phone: fsData.phone || '',
                    email: fsData.email || ''
                });
            }
        } catch (error) {
            console.error("Error loading contact:", error);
            Swal.fire({
                icon: 'error', title: 'Load Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const { db } = initFirebase();

        try {
            const docRef = doc(db, "portfolio", "contact");
            await setDoc(docRef, { data: contact }, { merge: true });

            Swal.fire({
                icon: 'success', title: 'Saved!', text: 'Contact info updated successfully.',
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3', timer: 1500
            });
        } catch (error) {
            console.error("Error saving contact:", error);
            Swal.fire({
                icon: 'error', title: 'Save Failed', text: error.message,
                background: '#1a1a1a', color: '#fff', confirmButtonColor: '#2196F3'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted"><i className="fas fa-spinner fa-spin text-2xl"></i> Loading...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">Contact Information</h3>
                <button onClick={handleSave} disabled={saving} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center gap-2 disabled:opacity-50">
                    {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                </button>
            </div>

            <div className="bg-transparent mt-2">
                <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-text-secondary mb-2">Address</label>
                        <input type="text" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="e.g. Egypt, Cairo" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-text-secondary mb-2">Phone</label>
                        <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="e.g. +20 100 051 ..." />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[14px] font-medium text-text-secondary mb-2">Email</label>
                        <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-brand-light focus:bg-white/10" placeholder="e.g. your@email.com" />
                    </div>
                </form>
            </div>
        </div>
    );
}
