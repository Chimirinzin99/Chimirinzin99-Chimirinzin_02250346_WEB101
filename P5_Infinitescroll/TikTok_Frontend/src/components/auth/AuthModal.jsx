'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { LoginForm, RegisterForm } from './AuthForms';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Log In' : 'Sign Up'}>
      {mode === 'login'
        ? <LoginForm onSuccess={onClose} onSwitchToRegister={() => setMode('register')} />
        : <RegisterForm onSuccess={onClose} onSwitchToLogin={() => setMode('login')} />
      }
    </Modal>
  );
}