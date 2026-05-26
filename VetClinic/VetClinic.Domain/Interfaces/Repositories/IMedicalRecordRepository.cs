using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Repositories;

public interface IMedicalRecordRepository : IGenericRepository<MedicalRecord>
{
    Task<MedicalRecord?> GetByAppointmentAsync(int appointmentId);
    Task<MedicalRecord?> GetByIdWithDetailsAsync(int id);
}