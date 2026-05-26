using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;

namespace VetClinic.DataAccess.Repositories;

public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(VetDbContext context) : base(context) { }

    public async Task<Appointment?> GetByIdWithDetailsAsync(int id)
        => await _dbSet
            .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
            .Include(a => a.Veterinarian)
            .Include(a => a.MedicalRecord)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Appointment>> GetByPetAsync(int petId)
        => await _dbSet
            .Where(a => a.PetId == petId)
            .Include(a => a.Veterinarian)
            .Include(a => a.MedicalRecord)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

    public async Task<IEnumerable<Appointment>> GetByVeterinarianAsync(int veterinarianId)
        => await _dbSet
            .Where(a => a.VeterinarianId == veterinarianId)
            .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
            .Include(a => a.MedicalRecord)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();
}