-- Seed Curated Journeys
-- Run this after games are populated

-- Journey 1: From Darkness to Light
INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated)
VALUES (
  'From Darkness to Light',
  'A transformative journey through shadow into luminescence',
  '[
    {"gameId": "480", "order": 1},
    {"gameId": "304430", "order": 2},
    {"gameId": "557600", "order": 3},
    {"gameId": "683320", "order": 4},
    {"gameId": "638230", "order": 5},
    {"gameId": "384380", "order": 6}
  ]'::jsonb,
  '{
    "emotions": [],
    "transitions": []
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Journey 2: The Cozy Escapist
INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated)
VALUES (
  'The Cozy Escapist',
  'Gentle games for when the world feels too loud',
  '[
    {"gameId": "413150", "order": 1},
    {"gameId": "1055540", "order": 2},
    {"gameId": "1135190", "order": 3},
    {"gameId": "914800", "order": 4},
    {"gameId": "1408210", "order": 5}
  ]'::jsonb,
  '{
    "emotions": [],
    "transitions": []
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Journey 3: Existential Explorer
INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated)
VALUES (
  'Existential Explorer',
  'Games that make you question everything',
  '[
    {"gameId": "221910", "order": 1},
    {"gameId": "753640", "order": 2},
    {"gameId": "653530", "order": 3},
    {"gameId": "632470", "order": 4}
  ]'::jsonb,
  '{
    "emotions": [],
    "transitions": []
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Journey 4: Indie Masterclass
INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated)
VALUES (
  'Indie Masterclass',
  'The cream of indie game design',
  '[
    {"gameId": "504230", "order": 1},
    {"gameId": "367520", "order": 2},
    {"gameId": "1145360", "order": 3},
    {"gameId": "1404200", "order": 4},
    {"gameId": "1092790", "order": 5}
  ]'::jsonb,
  '{
    "emotions": [],
    "transitions": []
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Journey 5: Narrative Wonders
INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated)
VALUES (
  'Narrative Wonders',
  'Stories that stay with you forever',
  '[
    {"gameId": "501300", "order": 1},
    {"gameId": "383870", "order": 2},
    {"gameId": "303210", "order": 3},
    {"gameId": "206440", "order": 4}
  ]'::jsonb,
  '{
    "emotions": [],
    "transitions": []
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;

