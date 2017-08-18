const NEUTRAL_TEAM = {
    'body': '#fff',
    'leg': '#fff',
    'head': '#fff'
};

const PLAYER_TEAM = {
    'body': '#4c2',
    'leg': '#381',
    'head': '#2f7'
};

const ENEMY_TEAM = {
    'head': '#850000',
    'body': '#ef0404',
    'leg': '#5d0505'
};

PLAYER_TEAM.enemy = ENEMY_TEAM;
ENEMY_TEAM.enemy = PLAYER_TEAM;
