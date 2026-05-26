using VetClinic.Domain.Entities;

namespace VetClinic.Domain.Interfaces.Repositories;

public interface IVeterinarianRepository : IGenericRepository<Veterinarian>
{
    Task<IEnumerable<Veterinarian>> GetAllWithAppointmentsAsync();
}