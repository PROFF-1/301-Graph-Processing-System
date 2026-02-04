import React, { useState } from 'react';
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

interface NewGraphDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export const NewGraphDialog: React.FC<NewGraphDialogProps> = ({
    isOpen,
    onClose,
    onCreate,
}) => {
    const [name, setName] = useState('');

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Graph</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new graph to save it to your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="My Awesome Graph"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create Graph</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
