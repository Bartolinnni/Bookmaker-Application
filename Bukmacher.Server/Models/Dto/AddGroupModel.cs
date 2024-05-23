namespace Bukmacher.Server.Models.Dto;

public class AddGroupModel
{
    public string Name { get; set; }
    public string OwnerName { get; set; }
    public List<string> MembersIds { get; set; }
    public string Description { get; set; }
}