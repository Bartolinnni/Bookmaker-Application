namespace Bukmacher.Database.Models;

public class Group
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string OwnerId { get; set; }
    public List<string> MembersId { get; set; }
    public List<GroupBet> GroupBets { get; set; }
    public string Description { get; set; }
}