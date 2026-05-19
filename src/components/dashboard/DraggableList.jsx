import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * A single sortable item wrapper.
 * Provides a drag handle (grip icon) and wraps the renderItem output.
 */
function SortableItem({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-3 group">
            {/*
              * Drag Handle
              * `touch-action: none` is REQUIRED on mobile — without it, the browser's
              * native scroll handler grabs the touchmove event first and the item never drags.
              */}
            <button
                {...attributes}
                {...listeners}
                style={{ touchAction: 'none' }}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                           text-white/30 hover:text-white hover:bg-white/10
                           cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
                aria-label="Drag to reorder"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                </svg>
            </button>
            {/* Item Content */}
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}

/**
 * DraggableList — a reusable vertical drag-and-drop sortable list.
 *
 * Props:
 *   items       — array of items (each must have a unique `id` or will use index)
 *   onReorder   — called with the new array after a drag ends
 *   renderItem  — (item, index) => JSX — renders each item's content
 *   getItemId   — (item, index) => string|number — returns a unique ID for each item
 */
export default function DraggableList({ items, onReorder, renderItem, getItemId }) {
    const sensors = useSensors(
        // Mouse/stylus: activate after moving 5px to avoid accidental drags on clicks.
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        // Touch: hold for 200ms before drag starts.
        // A quick swipe (<200ms) still scrolls the page normally.
        // A deliberate press-and-hold on the ⠿ grip initiates the drag.
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 8 },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const ids = items.map((item, i) => String(getItemId ? getItemId(item, i) : (item.id ?? i)));

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = arrayMove([...items], oldIndex, newIndex);
        onReorder(newItems);
    }

    if (!items || items.length === 0) return null;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                    {items.map((item, index) => {
                        const id = ids[index];
                        return (
                            <SortableItem key={id} id={id}>
                                {renderItem(item, index)}
                            </SortableItem>
                        );
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
