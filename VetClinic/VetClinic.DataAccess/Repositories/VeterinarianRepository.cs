using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;

namespace VetClinic.DataAccess.Repositories;

public class VeterinarianRepository : GenericRepository<Veterinarian>, IVeterinarianRepository
{
    public VeterinarianRepository(VetDbContext context) : base(context) { }

    public async Task<IEnumerable<Veterinarian>> GetAllWithAppointmentsAsync()
        => await _dbSet
            .Include(v => v.Appointments)
            .ToListAsync();
}