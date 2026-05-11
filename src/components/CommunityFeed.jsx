"use client";

export default function CommunityFeed() {

  const comments = [

    {
      id: 1,
      user: "Lucas",
      text: "Paiva amanheceu clássico hoje 🌊",
    },

    {
      id: 2,
      user: "Marina",
      text: "Vento terral cedo e séries lisas.",
    },

    {
      id: 3,
      user: "Rafael",
      text: "Crowd pesado no outside.",
    },

    {
      id: 4,
      user: "Bruno",
      text: "Entrou swell no final da tarde.",
    },

  ];

  return (

    <div className="community-wrapper">

      <div className="community-carousel">

        {[...comments, ...comments].map((item, index) => (

          <div
            key={index}
            className="community-card"
          >

            <strong>
              @{item.user}
            </strong>

            <p>
              {item.text}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}