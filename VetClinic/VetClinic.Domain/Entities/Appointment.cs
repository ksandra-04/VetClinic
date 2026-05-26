using VetClinic.Domain.Enums;

namespace VetClinic.Domain.Entities;

// Tabla intermedia N:M entre Pet y Veterinarian (igual que TournamentTeam en SportsLeague)
public class Appointment : AuditBase
{
    public int PetId { get; set; }
    public int VeterinarianId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Navigation Properties
    public Pet Pet { get; set; } = null!;
    public Veterinarian Veterinarian { get; set; } = null!;
    public MedicalRecord? MedicalRecord { get; set; }
}