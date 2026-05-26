using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Repositories;

public interface IAppointmentRepository : IGenericRepository<Appointment>
{
    Task<Appointment?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Appointment>> GetByPetAsync(int petId);
    Task<IEnumerable<Appointment>> GetByVeterinarianAsync(int veterinarianId);
}