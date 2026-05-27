using AutoMapper;
using VetClinic.API.DTOs.Request;
using VetClinic.API.DTOs.Response;
using VetClinic.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VetClinic.API.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Owner
        CreateMap<OwnerRequestDTO, Owner>();
        CreateMap<Owner, OwnerResponseDTO>()
            .ForMember(dest => dest.PetsCount,
                opt => opt.MapFrom(src => src.Pets != null ? src.Pets.Count : 0));

        // Pet
        CreateMap<PetRequestDTO, Pet>();
        CreateMap<Pet, PetResponseDTO>()
            .ForMember(dest => dest.OwnerFullName,
                opt => opt.MapFrom(src => src.Owner != null
                    ? $"{src.Owner.FirstName} {src.Owner.LastName}" : "N/A"))
            .ForMember(dest => dest.TypeName,
                opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.AppointmentsCount,
                opt => opt.MapFrom(src => src.Appointments != null ? src.Appointments.Count : 0));

        // Veterinarian
        CreateMap<VeterinarianRequestDTO, Veterinarian>();
        CreateMap<Veterinarian, VeterinarianResponseDTO>();

        // Appointment
        CreateMap<AppointmentRequestDTO, Appointment>();
        CreateMap<Appointment, AppointmentResponseDTO>()
            .ForMember(dest => dest.PetName,
                opt => opt.MapFrom(src => src.Pet != null ? src.Pet.Name : "N/A"))
            .ForMember(dest => dest.OwnerFullName,
                opt => opt.MapFrom(src => src.Pet != null && src.Pet.Owner != null
                    ? $"{src.Pet.Owner.FirstName} {src.Pet.Owner.LastName}" : "N/A"))
            .ForMember(dest => dest.VeterinarianFullName,
                opt => opt.MapFrom(src => src.Veterinarian != null
                    ? $"{src.Veterinarian.FirstName} {src.Veterinarian.LastName}" : "N/A"))
            .ForMember(dest => dest.VeterinarianSpecialty,
                opt => opt.MapFrom(src => src.Veterinarian != null ? src.Veterinarian.Specialty : "N/A"))
            .ForMember(dest => dest.HasMedicalRecord,
                opt => opt.MapFrom(src => src.MedicalRecord != null));

        // MedicalRecord
        CreateMap<MedicalRecordRequestDTO, MedicalRecord>();
        CreateMap<MedicalRecord, MedicalRecordResponseDTO>()
            .ForMember(dest => dest.PetName,
                opt => opt.MapFrom(src => src.Appointment != null && src.Appointment.Pet != null
                    ? src.Appointment.Pet.Name : "N/A"))
            .ForMember(dest => dest.VeterinarianFullName,
                opt => opt.MapFrom(src => src.Appointment != null && src.Appointment.Veterinarian != null
                    ? $"{src.Appointment.Veterinarian.FirstName} {src.Appointment.Veterinarian.LastName}" : "N/A"));
    }
}