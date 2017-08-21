const NEUTRAL_TEAM = {
    'body': '#fff',
    'leg': '#fff',
    'head': '#fff',
    'beacon': '#fff'
};

const PLAYER_TEAM = {
    'body': '#4c2',
    'leg': '#381',
    'head': '#2f7',
    'beacon': '#0f0',
    'behavior': position => new Idle(position)
};

const ENEMY_TEAM = {
    'head': '#850000',
    'body': '#ef0404',
    'leg': '#5d0505',
    'beacon': '#f00',
    'behavior': () => new Autonomous()
};

PLAYER_TEAM.enemy = ENEMY_TEAM;
ENEMY_TEAM.enemy = PLAYER_TEAM;
