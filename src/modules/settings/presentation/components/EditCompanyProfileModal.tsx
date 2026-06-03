import React, { useState, useEffect } from 'react';
import type { CompanyResponse } from '@/modules/settings/domain/models/User';
import type { UpdateCompanyRequest } from '@/modules/customers/domain/repositories/CompanyRepository';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Mail,
  Save
} from 'lucide-react';

interface EditCompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current company data — used to pre-fill ALL fields */
  company: CompanyResponse;
  isSaving: boolean;
  onSave: (data: UpdateCompanyRequest) => Promise<void>;
}

/**
 * EditCompanyProfileModal
 *
 * Sends all fields that the backend UpdateCompanyRequest accepts.
 * Pre-fills from the current CompanyResponse so nothing is lost on save.
 *
 * Backend UpdateCompanyRequest fields (all optional):
 *   companyName, socialReason, companyRuc, companyAddress,
 *   companyParishId, companyCountry, companyEmails[], companyPhones[],
 *   identificationType
 */
export const EditCompanyProfileModal: React.FC<EditCompanyProfileModalProps> = ({
  isOpen,
  onClose,
  company,
  isSaving,
  onSave
}) => {
  const [form, setForm] = useState<UpdateCompanyRequest>({});

  // Pre-fill ALL fields from current company profile
  useEffect(() => {
    if (!isOpen) return;
    setForm({
      companyName:       company.commercialName ?? '',
      socialReason:      company.businessName   ?? '',
      companyRuc:        company.ruc             ?? '',
      companyAddress:    company.address         ?? '',
      companyParishId:   company.parishId        ?? '',
      companyCountry:    company.country         ?? 'ECUADOR',
      companyEmails:     company.emails.map(e => e.correo),
      companyPhones:     company.phones.map(p => p.numero),
      identificationType: 'RUC'                             // companies always use RUC
    });
  }, [isOpen, company]);

  const setField = (field: keyof UpdateCompanyRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setEmails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, companyEmails: values }));
  };

  const setPhones = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, companyPhones: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  const footer = (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
      <Button variant="secondary" onClick={onClose} disabled={isSaving}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        leftIcon={<Save size={16} />}
        isLoading={isSaving}
        onClick={handleSubmit}
      >
        Guardar cambios
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar perfil — Empresa"
      footer={footer}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Nombre comercial"
            name="companyName"
            value={form.companyName ?? ''}
            onChange={setField('companyName')}
            leftIcon={<Building2 size={16} />}
            placeholder="Nombre comercial"
          />
          <Input
            label="Razón social"
            name="socialReason"
            value={form.socialReason ?? ''}
            onChange={setField('socialReason')}
            leftIcon={<Building2 size={16} />}
            placeholder="Razón social"
          />
        </div>

        {/* Address & country */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <Input
            label="Dirección"
            name="companyAddress"
            value={form.companyAddress ?? ''}
            onChange={setField('companyAddress')}
            leftIcon={<MapPin size={16} />}
            placeholder="Ej: Av. Principal 123, Quito"
          />
          <Input
            label="País"
            name="companyCountry"
            value={form.companyCountry ?? ''}
            onChange={setField('companyCountry')}
            leftIcon={<Globe size={16} />}
            placeholder="ECUADOR"
          />
        </div>

        {/* Emails */}
        <Input
          label="Correos (separados por coma)"
          name="companyEmails"
          value={(form.companyEmails ?? []).join(', ')}
          onChange={setEmails}
          leftIcon={<Mail size={16} />}
          placeholder="Ej: info@empresa.com, ventas@empresa.com"
        />

        {/* Phones */}
        <Input
          label="Teléfonos (separados por coma)"
          name="companyPhones"
          value={(form.companyPhones ?? []).join(', ')}
          onChange={setPhones}
          leftIcon={<Phone size={16} />}
          placeholder="Ej: 023456789, 0991234567"
        />

        {/* Parish */}
        <Input
          label="ID de Parroquia"
          name="companyParishId"
          value={form.companyParishId ?? ''}
          onChange={setField('companyParishId')}
          placeholder="Ej: 010150"
        />
      </form>
    </Modal>
  );
};
