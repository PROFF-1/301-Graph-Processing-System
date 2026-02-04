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
import { AlgorithmConfig } from "@/types/graph";

interface AlgorithmSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    config: AlgorithmConfig;
    onSave: (config: AlgorithmConfig) => void;
}

export const AlgorithmSettingsDialog: React.FC<AlgorithmSettingsDialogProps> = ({
    isOpen,
    onClose,
    config,
    onSave,
}) => {
    const [localConfig, setLocalConfig] = useState<AlgorithmConfig>(config);

    // Sync with prop when it changes or dialog opens
    useEffect(() => {
        setLocalConfig(config);
    }, [config, isOpen]);

    const handleSave = () => {
        onSave(localConfig);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Algorithm Configuration</DialogTitle>
                    <DialogDescription>
                        Adjust the parameters for the algorithms.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dampingFactor" className="text-right">
                            Damping Factor
                        </Label>
                        <Input
                            id="dampingFactor"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={localConfig.dampingFactor}
                            onChange={(e) => setLocalConfig({ ...localConfig, dampingFactor: parseFloat(e.target.value) })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxIterations" className="text-right">
                            Max Iterations
                        </Label>
                        <Input
                            id="maxIterations"
                            type="number"
                            min="1"
                            value={localConfig.maxIterations}
                            onChange={(e) => setLocalConfig({ ...localConfig, maxIterations: parseInt(e.target.value) })}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
