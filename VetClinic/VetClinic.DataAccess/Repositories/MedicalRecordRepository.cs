using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Interfaces.Repositories;

namespace VetClinic.DataAccess.Repositories;

public class MedicalRecordRepository : GenericRepository<MedicalRecord>, IMedicalRecordRepository
{
    public MedicalRecordRepository(VetDbContext context) : base(context) { }

    public async Task<MedicalRecord?> GetByAppointmentAsync(int appointmentId)
        => await _dbSet
            .FirstOrDefaultAsync(m => m.AppointmentId == appointmentId);

    public async Task<MedicalRecord?> GetByIdWithDetailsAsync(int id)
        => await _dbSet
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Pet)
            .Include(m => m.Appointment)
                .ThenInclude(a => a.Veterinarian)
            .FirstOrDefaultAsync(m => m.Id == id);
}