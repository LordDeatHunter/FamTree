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
public class FamilyMemberController(FamilyTreeDbContext context) : ControllerBase
{
    [HttpGet]
    [Route("get_all_members")]
    public IActionResult GetAllFamilyMembers()
    {
        var members = context.FamilyTree
            .Include(m => m.Father)
            .Include(m => m.Mother)
            .ToList();
        return Ok(members);
    }

    [HttpGet]
    [Route("get_member/{id}")]
    public IActionResult GetFamilyMember(string id)
    {
        var member = context.FamilyTree
            .Include(m => m.Father)
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id.ToString() == id);

        return member == null ? NotFound(new { message = "Member not found" }) : Ok(member);
    }

    [HttpGet]
    [Route("get_parents/{id}")]
    public IActionResult GetParents(string id)
    {
        var person = context.FamilyTree
            .Include(m => m.Father)
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id.ToString() == id);
        if (person == null) return NotFound(new { message = "Member not found" });
        var parents = new List<FamilyMember?>();
        var father = context.FamilyTree
            .FirstOrDefault(m => m.Gender == Male && person.Father != null && person.Father.Id == m.Id);
        var mother = context.FamilyTree
            .FirstOrDefault(m => m.Gender == Female && person.Mother != null && person.Mother.Id == m.Id);
        parents.Add(father);
        parents.Add(mother);
        return Ok(parents);
    }

    [HttpGet]
    [Route("get_father/{id}")]
    public IActionResult GetFather(string id)
    {
        var person = context.FamilyTree
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id.ToString() == id);
        if (person == null) return NotFound(new { message = "Member not found" });
        return Ok(context.FamilyTree
            .FirstOrDefault(m => m.Gender == Male && person.Father != null && person.Father.Id == m.Id)
        );
    }

    [HttpGet]
    [Route("get_mother/{id}")]
    public IActionResult GetMother(string id)
    {
        var person = context.FamilyTree
            .Include(m => m.Mother)
            .FirstOrDefault(m => m.Id.ToString() == id);
        if (person == null) return NotFound(new { message = "Member not found" });
        return Ok(context.FamilyTree.FirstOrDefault(
            m => m.Gender == Female && person.Mother != null && person.Mother.Id == m.Id)
        );
    }

    [HttpGet]
    [Route("get_children/{id}")]
    public IActionResult GetChildren(string id)
    {
        var person = context.FamilyTree.FirstOrDefault(m => m.Id.ToString() == id);
        return person == null
            ? NotFound(new { message = "Member not found" })
            : Ok(context.FamilyTree.Where(m =>
                    (person.Gender == Male && m.Father != null && m.Father.Id == person.Id) ||
                    (person.Gender == Female && m.Mother != null && m.Mother.Id == person.Id))
                .ToList()
            );
    }

    [HttpPost]
    [Route("add_member")]
    public IActionResult AddMember([FromBody] FamilyMember member)
    {
        var birthDateOnly = member.BirthDate;
        var deathDateOnly = member.DeathDate;
        var familyMember = FamilyMember.CreateUniqueMember(member.CurrentName, member.BirthName, member.BirthLocation,
            member.CurrentLocation, birthDateOnly, deathDateOnly, member.Gender, member.Note, context);

        context.FamilyTree.Add(familyMember);
        context.SaveChanges();

        if (member.Father == null && member.Mother == null)
        {
            return Ok(familyMember);
        }

        var person = context.FamilyTree
            .Include(m => m.Mother)
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id == familyMember.Id);
        if (person == null)
        {
            return Ok(familyMember);
        }

        if (member.Father != null)
        {
            var father = context.FamilyTree
                .Include(m => m.Father)
                .Include(m => m.Mother)
                .FirstOrDefault(m => m.Id == member.Father.Id);
            if (father != null) person.Father = father;
        }

        if (member.Mother != null)
        {
            var mother = context.FamilyTree
                .Include(m => m.Father)
                .Include(m => m.Mother)
                .FirstOrDefault(m => m.Id == member.Mother.Id);
            if (mother != null) person.Mother = mother;
        }

        context.FamilyTree.Update(person);
        context.SaveChanges();

        return Ok(familyMember);
    }

    [HttpDelete]
    [Route("delete_member/{id}")]
    public IActionResult DeleteMember(string id)
    {
        var member = context.FamilyTree.FirstOrDefault(m => m.Id.ToString() == id);
        if (member == null) return NotFound(new { message = "Member not found" });

        context.FamilyTree.Remove(member);
        context.SaveChanges();

        return Ok(new { message = "Member deleted" });
    }

    [HttpPatch]
    [Route("modify_member")]
    public IActionResult ModifyMember([FromBody] FamilyMemberDto member)
    {
        var person = context.FamilyTree
            .Include(m => m.Mother)
            .Include(m => m.Father)
            .FirstOrDefault(m => m.Id.ToString() == member.Id);

        if (person == null)
        {
            return NotFound(new { message = "Member not found" });
        }

        if (member.Gender != null) person.Gender = member.Gender.Value;
        if (member.CurrentName != null) person.CurrentName = member.CurrentName;
        if (member.BirthName != null) person.BirthName = member.BirthName;
        if (member.BirthLocation != null) person.BirthLocation = member.BirthLocation;
        if (member.CurrentLocation != null) person.CurrentLocation = member.CurrentLocation;
        if (member.BirthDate != null) person.BirthDate = member.BirthDate;
        if (member.DeathDate != null) person.DeathDate = member.DeathDate;
        if (member.Note != null) person.Note = member.Note;
        if (member.FatherId != null)
        {
            var father = context.FamilyTree
                .Include(m => m.Father)
                .Include(m => m.Mother)
                .FirstOrDefault(m => m.Id.ToString() == member.FatherId);

            if (father != null) person.Father = father;
        }

        if (member.MotherId != null)
        {
            var mother = context.FamilyTree
                .Include(m => m.Father)
                .Include(m => m.Mother)
                .FirstOrDefault(m => m.Id.ToString() == member.MotherId);

            if (mother != null) person.Mother = mother;
        }

        context.FamilyTree.Update(person);
        context.SaveChanges();

        return Ok(person);
    }
}