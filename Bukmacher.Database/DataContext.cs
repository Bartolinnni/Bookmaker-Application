﻿using Microsoft.EntityFrameworkCore;
using Bukmacher.Database.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Bukmacher.Database
{
    public class DataContext : IdentityDbContext<IdentityUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Team> Teams { get; set; }
        public DbSet<IndividualBet> IndividualBets { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<GroupBet> GroupBets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IndividualBet>()
                .HasKey(ib => ib.Id);

            modelBuilder.Entity<IndividualBet>()
                .HasOne(ib => ib.Match)
                .WithMany(m => m.IndividualBetsList)
                .HasForeignKey(ib => ib.MatchId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Match>()
                .HasKey(m => m.Id);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany(t => t.HomeMatches)
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany(t => t.AwayMatches)
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Team>()
                .HasKey(t => t.Id);

            modelBuilder.Entity<Group>()
                .HasKey(g => g.Id);

            modelBuilder.Entity<GroupBet>()
                .HasKey(gb => gb.Id);

            modelBuilder.Entity<GroupBet>()
                .HasOne(gb => gb.Group)
                .WithMany(g => g.GroupBets)
                .HasForeignKey(gb => gb.GroupId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<GroupBet>()
                .HasOne(gb => gb.Match)
                .WithMany()
                .HasForeignKey(gb => gb.MatchId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Notification>()
                .HasKey(n => n.Id);
        }
    }
}
