using Microsoft.Extensions.Logging;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Enums;
using VetClinic.Domain.Interfaces.Repositories;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.Domain.Services;

public class MedicalRecordService : IMedicalRecordService
{
    private readonly IMedicalRecordRepository _medicalRecordRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly ILogger<MedicalRecordService> _logger;

    public MedicalRecordService(
        IMedicalRecordRepository medicalRecordRepository,
        IAppointmentRepository appointmentRepository,
        ILogger<MedicalRecordService> logger)
    {
        _medicalRecordRepository = medicalRecordRepository;
        _appointmentRepository = appointmentRepository;
        _logger = logger;
    }

    public async Task<MedicalRecord> GetByIdAsync(int id)
    {
        var record = await _medicalRecordRepository.GetByIdWithDetailsAsync(id);
        if (record == null)
            throw new KeyNotFoundException($"No se encontró el registro médico con ID {id}");
        return record;
    }

    public async Task<MedicalRecord?> GetByAppointmentAsync(int appointmentId)
    {
        var appointmentExists = await _appointmentRepository.ExistsAsync(appointmentId);
        if (!appointmentExists)
            throw new KeyNotFoundException($"No se encontró la cita con ID {appointmentId}");
        return await _medicalRecordRepository.GetByAppointmentAsync(appointmentId);
    }

    public async Task CreateAsync(MedicalRecord record)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(record.AppointmentId);
        if (appointment == null)
            throw new KeyNotFoundException($"No se encontró la cita con ID {record.AppointmentId}");

        // Solo se puede crear registro en citas activas o terminadas
        if (appointment.Status == AppointmentStatus.Scheduled ||
            appointment.Status == AppointmentStatus.Cancelled)
            throw new InvalidOperationException(
                "Solo se puede crear un registro médico para citas en estado InProgress o Completed");

        // Verificar que no existe ya un registro para esta cita
        var existing = await _medicalRecordRepository.GetByAppointmentAsync(record.AppointmentId);
        if (existing != null)
            throw new InvalidOperationException("Esta cita ya tiene un registro médico asociado");

        record.RecordDate = DateTime.UtcNow;
        record.CreatedAt = DateTime.UtcNow;

        _logger.LogInformation("Creando registro médico para cita {AppointmentId}", record.AppointmentId);
        await _medicalRecordRepository.CreateAsync(record);
    }

    public async Task UpdateAsync(int id, MedicalRecord record)
    {
        var existing = await _medicalRecordRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró el registro médico con ID {id}");

        existing.Diagnosis = record.Diagnosis;
        existing.Treatment = record.Treatment;
        existing.Weight = record.Weight;
        existing.Observations = record.Observations;
        existing.UpdatedAt = DateTime.UtcNow;

        await _medicalRecordRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        var record = await _medicalRecordRepository.GetByIdAsync(id);
        if (record == null)
            throw new KeyNotFoundException($"No se encontró el registro médico con ID {id}");
        await _medicalRecordRepository.DeleteAsync(id);
    }
}