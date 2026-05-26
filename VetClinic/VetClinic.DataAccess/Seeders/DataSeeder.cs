using Microsoft.EntityFrameworkCore;
using VetClinic.DataAccess.Context;
using VetClinic.Domain.Entities;
using VetClinic.Domain.Enums;

namespace VetClinic.DataAccess.Seeders;

public static class DataSeeder
{
    public static async Task SeedAsync(VetDbContext context)
    {
        // Ejecución condicional: solo corre si la BD está vacía
        if (await context.Owners.AnyAsync()) return;

        // === 1. DUEÑOS ===
        var owners = new List<Owner>
        {
            new() { FirstName="Carlos",   LastName="Ramírez",   Phone="3001234567", Email="carlos@email.com",   Address="Calle 10 #20-30, Medellín",       CreatedAt=DateTime.UtcNow },
            new() { FirstName="María",    LastName="González",  Phone="3109876543", Email="maria@email.com",    Address="Carrera 45 #50-60, Medellín",     CreatedAt=DateTime.UtcNow },
            new() { FirstName="Andrés",   LastName="López",     Phone="3156789012", Email="andres@email.com",   Address="Av. El Poblado #80-90, Medellín", CreatedAt=DateTime.UtcNow },
            new() { FirstName="Daniela",  LastName="Martínez",  Phone="3004567890", Email="daniela@email.com",  Address="Calle 33 #76-40, Medellín",       CreatedAt=DateTime.UtcNow },
            new() { FirstName="Juan",     LastName="Pérez",     Phone="3202345678", Email="juan@email.com",     Address="Carrera 70 #12-50, Medellín",     CreatedAt=DateTime.UtcNow },
        };
        context.Owners.AddRange(owners);
        await context.SaveChangesAsync();

        // === 2. MASCOTAS (2 por dueño) ===
        var pets = new List<Pet>
        {
            new() { Name="Max",   Type=PetType.Dog,    Breed="Labrador",        BirthDate=new DateTime(2020,3,15),  OwnerId=owners[0].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Luna",  Type=PetType.Cat,    Breed="Persa",           BirthDate=new DateTime(2021,6,20),  OwnerId=owners[0].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Rocky", Type=PetType.Dog,    Breed="Bulldog",         BirthDate=new DateTime(2019,11,5),  OwnerId=owners[1].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Mia",   Type=PetType.Cat,    Breed="Siamés",          BirthDate=new DateTime(2022,1,10),  OwnerId=owners[1].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Toby",  Type=PetType.Dog,    Breed="Golden Retriever",BirthDate=new DateTime(2018,8,22),  OwnerId=owners[2].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Pío",   Type=PetType.Bird,   Breed="Canario",         BirthDate=new DateTime(2023,2,14),  OwnerId=owners[2].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Simba", Type=PetType.Cat,    Breed="Maine Coon",      BirthDate=new DateTime(2020,9,30),  OwnerId=owners[3].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Coco",  Type=PetType.Rabbit, Breed="Holandés",        BirthDate=new DateTime(2022,4,18),  OwnerId=owners[3].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Zeus",  Type=PetType.Dog,    Breed="Pastor Alemán",   BirthDate=new DateTime(2019,5,7),   OwnerId=owners[4].Id, CreatedAt=DateTime.UtcNow },
            new() { Name="Nala",  Type=PetType.Cat,    Breed="Ragdoll",         BirthDate=new DateTime(2021,12,25), OwnerId=owners[4].Id, CreatedAt=DateTime.UtcNow },
        };
        context.Pets.AddRange(pets);
        await context.SaveChangesAsync();

        // === 3. VETERINARIOS ===
        var vets = new List<Veterinarian>
        {
            new() { FirstName="Dr. Santiago",  LastName="Herrera", Specialty="Medicina General", LicenseNumber="VET-001-COL", Phone="3018765432", CreatedAt=DateTime.UtcNow },
            new() { FirstName="Dra. Valentina", LastName="Ríos",   Specialty="Cirugía",          LicenseNumber="VET-002-COL", Phone="3127654321", CreatedAt=DateTime.UtcNow },
            new() { FirstName="Dr. Camilo",     LastName="Mora",   Specialty="Dermatología",     LicenseNumber="VET-003-COL", Phone="3023456789", CreatedAt=DateTime.UtcNow },
            new() { FirstName="Dra. Isabella",  LastName="Castro", Specialty="Odontología",      LicenseNumber="VET-004-COL", Phone="3145678901", CreatedAt=DateTime.UtcNow },
        };
        context.Veterinarians.AddRange(vets);
        await context.SaveChangesAsync();

        // === 4. CITAS ===
        var appointments = new List<Appointment>
        {
            new() { PetId=pets[0].Id, VeterinarianId=vets[0].Id, AppointmentDate=new DateTime(2026,1,10,9,0,0),   Status=AppointmentStatus.Completed,  Reason="Vacunación anual",       CreatedAt=DateTime.UtcNow },
            new() { PetId=pets[1].Id, VeterinarianId=vets[0].Id, AppointmentDate=new DateTime(2026,1,15,10,30,0), Status=AppointmentStatus.Completed,  Reason="Revisión general",        CreatedAt=DateTime.UtcNow },
            new() { PetId=pets[2].Id, VeterinarianId=vets[1].Id, AppointmentDate=new DateTime(2026,2,5,11,0,0),   Status=AppointmentStatus.Completed,  Reason="Esterilización",          CreatedAt=DateTime.UtcNow },
            new() { PetId=pets[4].Id, VeterinarianId=vets[2].Id, AppointmentDate=new DateTime(2026,6,10,14,0,0),  Status=AppointmentStatus.Scheduled,  Reason="Problema de piel",        CreatedAt=DateTime.UtcNow },
            new() { PetId=pets[8].Id, VeterinarianId=vets[0].Id, AppointmentDate=new DateTime(2026,6,15,9,30,0),  Status=AppointmentStatus.Scheduled,  Reason="Control de peso anual",   CreatedAt=DateTime.UtcNow },
            new() { PetId=pets[5].Id, VeterinarianId=vets[3].Id, AppointmentDate=new DateTime(2026,6,5,11,0,0),   Status=AppointmentStatus.InProgress, Reason="Revisión dental",         CreatedAt=DateTime.UtcNow },
        };
        context.Appointments.AddRange(appointments);
        await context.SaveChangesAsync();

        // === 5. REGISTROS MÉDICOS (solo para citas Completed) ===
        var records = new List<MedicalRecord>
        {
            new() { AppointmentId=appointments[0].Id, Diagnosis="Mascota en excelente estado de salud", Treatment="Vacuna Triple Canina aplicada. Próxima dosis en 12 meses.", Weight=28.5m, RecordDate=appointments[0].AppointmentDate, CreatedAt=DateTime.UtcNow },
            new() { AppointmentId=appointments[1].Id, Diagnosis="Sin patologías encontradas",           Treatment="Desparasitación interna (Milbemax) y externa (Frontline).",  Weight=4.2m,  RecordDate=appointments[1].AppointmentDate, CreatedAt=DateTime.UtcNow },
            new() { AppointmentId=appointments[2].Id, Diagnosis="Procedimiento exitoso",                Treatment="Esterilización completa. Antibiótico Amoxicilina 5 días.",   Weight=22.1m, RecordDate=appointments[2].AppointmentDate, CreatedAt=DateTime.UtcNow },
        };
        context.MedicalRecords.AddRange(records);
        await context.SaveChangesAsync();
    }
}