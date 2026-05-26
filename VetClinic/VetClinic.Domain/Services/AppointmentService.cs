using Microsoft.Extensions.Logging;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Enums;
using VetClinic.Domain.Interfaces.Repositories;
using VetClinic.Domain.Interfaces.Services;

namespace VetClinic.Domain.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPetRepository _petRepository;
    private readonly IVeterinarianRepository _veterinarianRepository;
    private readonly ILogger<AppointmentService> _logger;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IPetRepository petRepository,
        IVeterinarianRepository veterinarianRepository,
        ILogger<AppointmentService> logger)
    {
        _appointmentRepository = appointmentRepository;
        _petRepository = petRepository;
        _veterinarianRepository = veterinarianRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync()
        => await _appointmentRepository.GetAllAsync();

    public async Task<Appointment> GetByIdAsync(int id)
    {
        var appointment = await _appointmentRepository.GetByIdWithDetailsAsync(id);
        if (appointment == null)
            throw new KeyNotFoundException($"No se encontró la cita con ID {id}");
        return appointment;
    }

    public async Task<IEnumerable<Appointment>> GetByPetAsync(int petId)
    {
        var petExists = await _petRepository.ExistsAsync(petId);
        if (!petExists)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {petId}");
        return await _appointmentRepository.GetByPetAsync(petId);
    }

    public async Task<IEnumerable<Appointment>> GetByVeterinarianAsync(int veterinarianId)
    {
        var vetExists = await _veterinarianRepository.ExistsAsync(veterinarianId);
        if (!vetExists)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {veterinarianId}");
        return await _appointmentRepository.GetByVeterinarianAsync(veterinarianId);
    }

    public async Task CreateAsync(Appointment appointment)
    {
        // Validar que la mascota existe
        var petExists = await _petRepository.ExistsAsync(appointment.PetId);
        if (!petExists)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {appointment.PetId}");

        // Validar que el veterinario existe
        var vetExists = await _veterinarianRepository.ExistsAsync(appointment.VeterinarianId);
        if (!vetExists)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {appointment.VeterinarianId}");

        appointment.Status = AppointmentStatus.Scheduled;
        appointment.CreatedAt = DateTime.UtcNow;

        _logger.LogInformation("Creando cita para mascota {PetId} con veterinario {VetId}",
            appointment.PetId, appointment.VeterinarianId);
        await _appointmentRepository.CreateAsync(appointment);
    }

    public async Task UpdateAsync(int id, Appointment appointment)
    {
        var existing = await _appointmentRepository.GetByIdAsync(id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró la cita con ID {id}");

        if (existing.Status != AppointmentStatus.Scheduled)
            throw new InvalidOperationException("Solo se pueden editar citas con estado Scheduled");

        var petExists = await _petRepository.ExistsAsync(appointment.PetId);
        if (!petExists)
            throw new KeyNotFoundException($"No se encontró la mascota con ID {appointment.PetId}");

        var vetExists = await _veterinarianRepository.ExistsAsync(appointment.VeterinarianId);
        if (!vetExists)
            throw new KeyNotFoundException($"No se encontró el veterinario con ID {appointment.VeterinarianId}");

        existing.PetId = appointment.PetId;
        existing.VeterinarianId = appointment.VeterinarianId;
        existing.AppointmentDate = appointment.AppointmentDate;
        existing.Reason = appointment.Reason;
        existing.Notes = appointment.Notes;
        existing.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepository.UpdateAsync(existing);
    }

    public async Task UpdateStatusAsync(int id, AppointmentStatus newStatus)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
            throw new KeyNotFoundException($"No se encontró la cita con ID {id}");

        // Máquina de estados — igual que en SportsLeague Tournament
        var validTransition = (appointment.Status, newStatus) switch
        {
            (AppointmentStatus.Scheduled, AppointmentStatus.InProgress) => true,
            (AppointmentStatus.InProgress, AppointmentStatus.Completed) => true,
            (AppointmentStatus.Scheduled, AppointmentStatus.Cancelled) => true,
            (AppointmentStatus.InProgress, AppointmentStatus.Cancelled) => true,
            _ => false
        };

        if (!validTransition)
            throw new InvalidOperationException(
                $"No se puede cambiar de {appointment.Status} a {newStatus}");

        _logger.LogInformation("Actualizando estado de cita {Id}: {OldStatus} -> {NewStatus}",
            id, appointment.Status, newStatus);

        appointment.Status = newStatus;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _appointmentRepository.UpdateAsync(appointment);
    }

    public async Task DeleteAsync(int id)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id);
        if (appointment == null)
            throw new KeyNotFoundException($"No se encontró la cita con ID {id}");

        if (appointment.Status != AppointmentStatus.Scheduled)
            throw new InvalidOperationException("Solo se pueden eliminar citas con estado Scheduled");

        await _appointmentRepository.DeleteAsync(id);
    }
}