const DEFAULT_PETS = [
  { emoji: '🐶', anim: 'pet-bounce', delay: '0s' },
  { emoji: '🐱', anim: 'pet-wiggle', delay: '0.2s' },
  { emoji: '🐰', anim: 'pet-bounce', delay: '0.4s' },
  { emoji: '🐹', anim: 'pet-float',  delay: '0.1s' },
  { emoji: '🐦', anim: 'pet-float',  delay: '0.5s' },
];

const PET_EMOJI_BY_TYPE = {
  '小型犬': ['🐶', '🐕', '🦴'],
  '大型犬': ['🐕‍🦺', '🐶', '🦴'],
  '猫': ['🐱', '🐈', '🐾'],
  '多頭飼い': ['🐶', '🐱', '🐰'],
  'うさぎ・小動物': ['🐰', '🐹', '🐭'],
  'その他': ['🐦', '🐢', '🐾'],
};

export function PetMascots({ petType }) {
  const emojis = (petType && PET_EMOJI_BY_TYPE[petType]) || null;

  const pets = emojis
    ? emojis.map((emoji, idx) => ({
        emoji,
        anim: ['pet-bounce', 'pet-wiggle', 'pet-float'][idx % 3],
        delay: `${idx * 0.2}s`,
      }))
    : DEFAULT_PETS;

  return (
    <div className="flex justify-center items-end gap-4 py-4 select-none" aria-hidden="true">
      {pets.map((pet, idx) => (
        <span
          key={idx}
          className={`text-4xl ${pet.anim}`}
          style={{ animationDelay: pet.delay }}
        >
          {pet.emoji}
        </span>
      ))}
    </div>
  );
}

export function WalkingPet({ emoji = '🐾', duration = '18s', top = '20%' }) {
  return (
    <span
      className="pet-walk text-3xl absolute pointer-events-none select-none"
      style={{ top, animationDuration: duration }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}
