import React from "react";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>홈으로 이동할까요?</h2>
        <p>진행 중인 면접은 저장되지 않습니다.</p>

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            취소
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
