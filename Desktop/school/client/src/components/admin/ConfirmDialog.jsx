import Modal from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action" size="sm">
      <div className="flex flex-col items-center p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <FiAlertTriangle size={24} />
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex gap-3 w-full justify-center">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
