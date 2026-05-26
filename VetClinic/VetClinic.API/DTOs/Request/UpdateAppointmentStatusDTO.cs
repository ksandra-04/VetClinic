using VetClinic.Domain.Enums;

namespace VetClinic.API.DTOs.Request;

public class UpdateAppointmentStatusDTO
{
    public AppointmentStatus Status { get; set; }
}