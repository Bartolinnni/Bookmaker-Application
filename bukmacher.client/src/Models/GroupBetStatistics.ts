export interface GroupBetStatistics {
    groupId: number,
    userId: string,
    username: string,
    betId: number;
    pointDate: string;
    gameId: number;
    teamAwayId: number;
    teamAwayName: string;
    teamAwayLogo: string;
    teamHomeId: number;
    teamHomeName: string;
    teamHomeLogo: string;
    predictedHomeTeamScore:number,
    predictedAwayTeamScore   : number
    points: number,
    homeTeamScore:number,
    awayTeamScore: number
}
