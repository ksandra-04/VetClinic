using VetClinic.Domain.Entities;
using VetClinic.Domain.Enums;

namespace VetClinic.Domain.Interfaces.Services;

public interface IAppointmentService
{
    Task<IEnumerable<Appointment>> GetAllAsync();
    Task<Appointment> GetByIdAsync(int id);
    Task<IEnumerable<Appointment>> GetByPetAsync(int petId);
    Task<IEnumerable<Appointment>> GetByVeterinarianAsync(int veterinarianId);
    Task CreateAsync(Appointment appointment);
    Task UpdateAsync(int id, Appointment appointment);
    Task UpdateStatusAsync(int id, AppointmentStatus newStatus);
    Task DeleteAsync(int id);
}