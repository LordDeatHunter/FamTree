using System;
using System.Collections.Generic;
using System.Linq;
using FamTreeApi.Models;
using Microsoft.AspNetCore.Mvc;

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
    public FamilyMember? GetFamilyMember(int uuid)
    {
        return _context.FamilyTree.FirstOrDefault(m => m.Id == uuid);
    }

    [HttpGet]
    [Route("get_parents")]
    public List<FamilyMember> GetParents(int uuid)
    {
        var person = _context.FamilyTree.FirstOrDefault(m => m.Id == uuid);
        var parents = new List<FamilyMember>();
        if (person == null) return parents;
        var father = _context.FamilyTree.FirstOrDefault(m => m.Id == person.Father);
        var mother = _context.FamilyTree.FirstOrDefault(m => m.Id == person.Mother);
        if (father != null) parents.Add(father);
        if (mother != null) parents.Add(mother);
        return parents;
    }

    [HttpPost]
    [Route("add_member")]
    public void Post(string birthName, string? currentName, DateTime birthDate, DateTime? deathDate,
        FamilyMember.EGender gender, int? father, int? mother)
    {
        var familyMember = new FamilyMember(birthName, currentName, birthDate, deathDate, gender);
        if (father != null && _context.FamilyTree
                .FirstOrDefault(m => m.Id == father && m.Gender == FamilyMember.EGender.Male) != null
           )
            familyMember.Father = father;

        if (mother != null && _context.FamilyTree
                .FirstOrDefault(m => m.Id == mother && m.Gender == FamilyMember.EGender.Female) != null
           )
            familyMember.Mother = mother;

        _context.FamilyTree.Add(familyMember);
        _context.SaveChanges();
    }
}