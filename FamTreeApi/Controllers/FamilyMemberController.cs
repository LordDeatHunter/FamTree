using System;
using System.Collections.Generic;
using System.Linq;
using FamTreeApi.Models;
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
    public void AddMember([FromBody] FamilyMember member)
    {
        var birthDateOnly = member.BirthDate;
        var deathDateOnly = member.DeathDate;
        var familyMember = FamilyMember.CreateUniqueMember(member.BirthName, member.CurrentName, member.BirthLocation,
            member.CurrentLocation, birthDateOnly, deathDateOnly, member.Gender, member.Note, _context);

        if (member.Father != null) familyMember.Father = member.Father;
        if (member.Mother != null) familyMember.Mother = member.Mother;

        _context.FamilyTree.Add(familyMember);
        _context.SaveChanges();
    }

    [HttpPost]
    [Route("modify_member")]
    public void ModifyMember(FamilyMember member)
    {
        var person = _context.FamilyTree
            .Include(m => m.Mother)
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id == member.Id);
        if (person == null) return;
        person.BirthName = member.BirthName;
        person.CurrentName = member.CurrentName;
        if (member.BirthLocation != null) person.BirthLocation = member.BirthLocation;
        if (member.CurrentLocation != null) person.CurrentLocation = member.CurrentLocation;
        if (member.BirthDate != null) person.BirthDate = member.BirthDate;
        if (member.DeathDate != null) person.DeathDate = member.DeathDate;
        person.Gender = member.Gender;
        if (member.Note != null) person.Note = member.Note;
        if (member.Father != null) person.Father = member.Father;
        if (member.Mother != null) person.Mother = member.Mother;

        _context.FamilyTree.Update(person);
        _context.SaveChanges();
    }
}