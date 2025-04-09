
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SubmitButtonProps {
  isSaving: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSaving }) => {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isSaving}
        className="px-4 py-2"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? 'Salvando...' : 'Salvar configurações'}
      </Button>
    </div>
  );
};

export default SubmitButton;
