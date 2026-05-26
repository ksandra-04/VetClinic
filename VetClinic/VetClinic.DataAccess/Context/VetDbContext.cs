using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using VetClinic.Domain.Entities;

namespace VetClinic.DataAccess.Context;

public class VetDbContext : DbContext
{
    public VetDbContext(DbContextOptions<VetDbContext> options) : base(options) { }

    public DbSet<Owner> Owners => Set<Owner>();
    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<Veterinarian> Veterinarians => Set<Veterinarian>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // --- Owner ---
        modelBuilder.Entity<Owner>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(o => o.LastName).IsRequired().HasMaxLength(100);
            entity.Property(o => o.Phone).IsRequired().HasMaxLength(20);
            entity.Property(o => o.Email).IsRequired().HasMaxLength(150);
            entity.Property(o => o.Address).HasMaxLength(200);
            entity.Property(o => o.CreatedAt).IsRequired();
            entity.Property(o => o.UpdatedAt).IsRequired(false);
        });

        // --- Pet ---
        modelBuilder.Entity<Pet>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Breed).HasMaxLength(100);
            entity.Property(p => p.Type).IsRequired();
            entity.Property(p => p.BirthDate).IsRequired();
            entity.Property(p => p.CreatedAt).IsRequired();
            entity.Property(p => p.UpdatedAt).IsRequired(false);

            entity.HasOne(p => p.Owner)
                .WithMany(o => o.Pets)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Veterinarian ---
        modelBuilder.Entity<Veterinarian>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(v => v.LastName).IsRequired().HasMaxLength(100);
            entity.Property(v => v.Specialty).IsRequired().HasMaxLength(150);
            entity.Property(v => v.LicenseNumber).IsRequired().HasMaxLength(50);
            entity.Property(v => v.Phone).HasMaxLength(20);
            entity.Property(v => v.CreatedAt).IsRequired();
            entity.Property(v => v.UpdatedAt).IsRequired(false);
        });

        // --- Appointment (N:M entre Pet y Veterinarian) ---
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.AppointmentDate).IsRequired();
            entity.Property(a => a.Status).IsRequired();
            entity.Property(a => a.Reason).IsRequired().HasMaxLength(300);
            entity.Property(a => a.Notes).HasMaxLength(500).IsRequired(false);
            entity.Property(a => a.CreatedAt).IsRequired();
            entity.Property(a => a.UpdatedAt).IsRequired(false);

            // Restrict evita ciclos de cascada (Pet tiene 2 FKs indirectas a través de Appointment)
            entity.HasOne(a => a.Pet)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PetId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Veterinarian)
                .WithMany(v => v.Appointments)
                .HasForeignKey(a => a.VeterinarianId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- MedicalRecord (1:1 con Appointment) ---
        modelBuilder.Entity<MedicalRecord>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Diagnosis).IsRequired().HasMaxLength(500);
            entity.Property(m => m.Treatment).IsRequired().HasMaxLength(500);
            entity.Property(m => m.Weight).HasColumnType("decimal(5,2)");
            entity.Property(m => m.Observations).HasMaxLength(1000).IsRequired(false);
            entity.Property(m => m.RecordDate).IsRequired();
            entity.Property(m => m.CreatedAt).IsRequired();
            entity.Property(m => m.UpdatedAt).IsRequired(false);

            entity.HasOne(m => m.Appointment)
                .WithOne(a => a.MedicalRecord)
                .HasForeignKey<MedicalRecord>(m => m.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}