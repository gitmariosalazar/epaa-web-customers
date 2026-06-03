import React, { useState, useEffect } from 'react';
import type { ClientResponse } from '@/modules/settings/domain/models/User';
import type { UpdateCustomerRequest } from '@/modules/customers/domain/repositories/CustomerRepository';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  User,
  MapPin,
  Phone,
  Globe,
  Mail,
  Save,
  Calendar
} from 'lucide-react';

interface EditCustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current person data — used to pre-fill ALL required backend fields */
  person: ClientResponse;
  /** customerId (cédula string) required by the backend update endpoint */
  customerId: string;
  isSaving: boolean;
  onSave: (data: UpdateCustomerRequest) => Promise<void>;
}

/**
 * EditCustomerProfileModal
 *
 * Sends ALL fields required by the backend UpdateCustomerRequest DTO.
 * Pre-fills from the current ClientResponse so nothing is lost on save.
 *
 * Backend required fields (UpdateCustomerRequest mirrors CreateCustomerRequest):
 *   customerId, firstName, lastName, emails[], phoneNumbers[],
 *   dateOfBirth, sexId, civilStatus, address, professionId,
 *   originCountry, identificationType, parishId, deceased?
 */
export const EditCustomerProfileModal: React.FC<EditCustomerProfileModalProps> = ({
  isOpen,
  onClose,
  person,
  customerId,
  isSaving,
  onSave
}) => {
  const [form, setForm] = useState<UpdateCustomerRequest>({});

  // Pre-fill ALL required fields from current person profile
  useEffect(() => {
    if (!isOpen) return;
    setForm({
      customerId,                                             // required
      firstName:        person.firstName   ?? '',            // required
      lastName:         person.lastName    ?? '',            // required
      emails:           person.emails.map(e => e.correo),   // required []
      phoneNumbers:     person.phones.map(p => p.numero),   // required []
      dateOfBirth:      person.birthDate   ?? '',           // required
      sexId:            person.genderId    ?? 1,            // required
      civilStatus:      person.civilStatusId ?? 1,          // required
      address:          person.address     ?? '',           // required
      professionId:     person.professionId ?? 1,           // required
      originCountry:    person.country     ?? 'ECUADOR',    // required
      identificationType: 'CED',                            // required — natural person
      parishId:         person.parishId   ?? '',            // required
      deceased:         Boolean(person.isDeceased)          // optional
    });
  }, [isOpen, person, customerId]);

  // Generic text field updater
  const setField = (field: keyof UpdateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  // Number field updater
  const setNumField = (field: keyof UpdateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: Number(e.target.value) }));

  // Array field (comma-separated)
  const setArrayField = (field: 'emails' | 'phoneNumbers') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
      setForm(prev => ({ ...prev, [field]: values }));
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
      title="Editar perfil — Persona Natural"
      footer={footer}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Nombres *"
            name="firstName"
            value={String(form.firstName ?? '')}
            onChange={setField('firstName')}
            leftIcon={<User size={16} />}
            placeholder="Ej: Juan Carlos"
            required
          />
          <Input
            label="Apellidos *"
            name="lastName"
            value={String(form.lastName ?? '')}
            onChange={setField('lastName')}
            leftIcon={<User size={16} />}
            placeholder="Ej: Pérez Gómez"
            required
          />
        </div>

        {/* Emails */}
        <Input
          label="Correos electrónicos * (separados por coma)"
          name="emails"
          value={(form.emails ?? []).join(', ')}
          onChange={setArrayField('emails')}
          leftIcon={<Mail size={16} />}
          placeholder="Ej: juan@correo.com, otro@correo.com"
          required
        />

        {/* Phones */}
        <Input
          label="Teléfonos * (separados por coma)"
          name="phoneNumbers"
          value={(form.phoneNumbers ?? []).join(', ')}
          onChange={setArrayField('phoneNumbers')}
          leftIcon={<Phone size={16} />}
          placeholder="Ej: 0991234567, 023456789"
          required
        />

        {/* Date of birth */}
        <Input
          label="Fecha de nacimiento *"
          name="dateOfBirth"
          type="date"
          value={
            form.dateOfBirth
              ? String(form.dateOfBirth).slice(0, 10)
              : ''
          }
          onChange={setField('dateOfBirth')}
          leftIcon={<Calendar size={16} />}
          required
        />

        {/* Numbers row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Input
            label="Género ID *"
            name="sexId"
            type="number"
            value={String(form.sexId ?? 1)}
            onChange={setNumField('sexId')}
            placeholder="1"
            required
          />
          <Input
            label="Estado Civil ID *"
            name="civilStatus"
            type="number"
            value={String(form.civilStatus ?? 1)}
            onChange={setNumField('civilStatus')}
            placeholder="1"
            required
          />
          <Input
            label="Profesión ID *"
            name="professionId"
            type="number"
            value={String(form.professionId ?? 1)}
            onChange={setNumField('professionId')}
            placeholder="1"
            required
          />
        </div>

        {/* Address & country */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <Input
            label="Dirección *"
            name="address"
            value={String(form.address ?? '')}
            onChange={setField('address')}
            leftIcon={<MapPin size={16} />}
            placeholder="Ej: Av. Principal 123"
            required
          />
          <Input
            label="País de origen *"
            name="originCountry"
            value={String(form.originCountry ?? '')}
            onChange={setField('originCountry')}
            leftIcon={<Globe size={16} />}
            placeholder="ECUADOR"
            required
          />
        </div>

        {/* Parish — read-only note */}
        <Input
          label="ID de Parroquia *"
          name="parishId"
          value={String(form.parishId ?? '')}
          onChange={setField('parishId')}
          placeholder="Ej: 010150"
          required
        />
      </form>
    </Modal>
  );
};
