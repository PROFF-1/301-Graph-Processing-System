import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditType = 'node' | 'edge' | null;

interface EditGraphDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type: EditType;
    initialValue: string | number; // label for node, weight for edge
    onSave: (value: string | number) => void;
    onDelete: () => void;
}

export const EditGraphDialog: React.FC<EditGraphDialogProps> = ({
    isOpen,
    onClose,
    type,
    initialValue,
    onSave,
    onDelete,
}) => {
    const [value, setValue] = useState<string | number>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue, isOpen]);

    const handleSave = () => {
        onSave(value);
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {type === 'node' ? 'Node' : 'Edge'}</DialogTitle>
                    <DialogDescription>
                        {type === 'node'
                            ? "Change the node label or delete the node."
                            : "Change the edge weight or delete the edge."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                            {type === 'node' ? 'Label' : 'Weight'}
                        </Label>
                        <Input
                            id="value"
                            type={type === 'edge' ? "number" : "text"}
                            value={value}
                            onChange={(e) => setValue(type === 'edge' ? Number(e.target.value) : e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
