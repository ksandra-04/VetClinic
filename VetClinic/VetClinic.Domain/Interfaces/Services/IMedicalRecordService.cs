using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Services;

public interface IMedicalRecordService
{
    Task<MedicalRecord> GetByIdAsync(int id);
    Task<MedicalRecord?> GetByAppointmentAsync(int appointmentId);
    Task CreateAsync(MedicalRecord record);
    Task UpdateAsync(int id, MedicalRecord record);
    Task DeleteAsync(int id);
}