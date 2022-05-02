using System;
using System.Collections.Generic;
using System.Linq;
using FamTreeApi.Models;
using FamTreeApi.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FamTreeApi.Utils.Gender;

namespace FamTreeApi.Controllers;

[ApiController]
[Route("api/familytree")]
public class FamilyMemberController : ControllerBase
{
    private readonly FamilyTreeDbContext _context;

    public FamilyMemberController(FamilyTreeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Route("get_all_members")]
    public List<FamilyMember> GetAllFamilyMembers()
    {
        return _context.FamilyTree.ToList();
    }

    [HttpGet]
    [Route("get_member")]
    public FamilyMember? GetFamilyMember(Guid uuid)
    {
        return _context.FamilyTree
            .Include(m => m.Father)
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id == uuid);
    }

    [HttpGet]
    [Route("get_parents")]
    public List<FamilyMember?> GetParents(Guid uuid)
    {
        var person = _context.FamilyTree
            .Include(m => m.Father)
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id == uuid);
        var parents = new List<FamilyMember?>();
        if (person == null) return parents;
        var father = _context.FamilyTree
            .FirstOrDefault(m => m.Gender == Male && person.Father != null && person.Father.Id == m.Id);
        var mother = _context.FamilyTree
            .FirstOrDefault(m => m.Gender == Female && person.Mother != null && person.Mother.Id == m.Id);
        parents.Add(father);
        parents.Add(mother);
        return parents;
    }

    [HttpGet]
    [Route("get_father")]
    public FamilyMember? GetFather(Guid uuid)
    {
        var person = _context.FamilyTree
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id == uuid);
        if (person == null) return null;
        return _context.FamilyTree
            .FirstOrDefault(m => m.Gender == Male && person.Father != null && person.Father.Id == m.Id);
    }

    [HttpGet]
    [Route("get_mother")]
    public FamilyMember? GetMother(Guid uuid)
    {
        var person = _context.FamilyTree
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id == uuid);
        if (person == null) return null;
        return _context.FamilyTree
            .FirstOrDefault(m => m.Gender == Female && person.Mother != null && person.Mother.Id == m.Id);
    }

    [HttpGet]
    [Route("get_children")]
    public List<FamilyMember> GetChildren(Guid uuid)
    {
        var person = _context.FamilyTree.FirstOrDefault(m => m.Id == uuid);
        return person == null
            ? new List<FamilyMember>()
            : _context.FamilyTree.Where(m =>
                    (person.Gender == Male && m.Father != null && m.Father.Id == person.Id) ||
                    (person.Gender == Female && m.Mother != null && m.Mother.Id == person.Id))
                .ToList();
    }

    [HttpPost]
    [Route("add_member")]
    public void AddMember(string birthName, string? currentName, string? birthLocation,
        string? currentLocation, DateTime? birthDate,
        DateTime? deathDate, Gender gender, string? note,
        Guid? fatherId, Guid? motherId)
    {
        DateOnly? birthDateOnly = birthDate == null ? null : DateOnly.FromDateTime(birthDate.Value);
        DateOnly? deathDateOnly = deathDate == null ? null : DateOnly.FromDateTime(deathDate.Value);
        var familyMember = FamilyMember.CreateUniqueMember(birthName, currentName, birthLocation, currentLocation,
            birthDateOnly, deathDateOnly, gender, note, _context);

        if (fatherId != null)
        {
            familyMember.Father = _context.FamilyTree
                .FirstOrDefault(m => m.Id == fatherId && m.Gender == Male);
        }

        if (motherId != null)
        {
            familyMember.Mother = _context.FamilyTree
                .FirstOrDefault(m => m.Id == motherId && m.Gender == Female);
        }

        _context.FamilyTree.Add(familyMember);
        _context.SaveChanges();
    }

    [HttpPost]
    [Route("modify_member")]
    public void ModifyMember(Guid uuid, string? birthName, string? currentName, string? birthLocation,
        string? currentLocation, DateTime? birthDate,
        DateTime? deathDate,
        Gender? gender, string? note,
        Guid? fatherId, Guid? motherId)
    {
        var person = _context.FamilyTree
            .Include(m => m.Mother)
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id == uuid);
        if (person == null) return;
        if (birthName != null) person.BirthName = birthName;
        if (currentName != null) person.CurrentName = currentName;
        if (birthLocation != null) person.BirthLocation = birthLocation;
        if (currentLocation != null) person.CurrentLocation = currentLocation;
        if (birthDate != null) person.BirthDate = DateOnly.FromDateTime(birthDate.Value);
        if (deathDate != null) person.DeathDate = DateOnly.FromDateTime(deathDate.Value);
        if (gender != null) person.Gender = (Gender)gender;
        if (note != null) person.Note = note;
        if (fatherId != null)
        {
            Console.WriteLine(person.Father == null);
            person.Father = _context.FamilyTree
                .FirstOrDefault(m => m.Id == fatherId && m.Gender == Male);
            Console.WriteLine(person.Father == null);
        }

        if (motherId != null)
        {
            person.Father = _context.FamilyTree
                .FirstOrDefault(m => m.Id == fatherId && m.Gender == Male);
        }

        _context.FamilyTree.Update(person);
        _context.SaveChanges();
    }
}