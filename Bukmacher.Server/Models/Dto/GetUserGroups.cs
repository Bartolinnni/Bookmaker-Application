using Bukmacher.Database.Models;

namespace Bukmacher.Server.Models.Dto;

public class GetUserGroups
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string OwnerId { get; set; }
    public List<string> MembersId { get; set; }
    public List<GroupBet> GroupBets { get; set; }
    public string OwnerName { get; set; }
}