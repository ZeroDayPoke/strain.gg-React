// ./src/components/DefaultComponents/About.jsx

import { Card, Button } from "react-bootstrap";

const About = () => {
  const imageBase = "http://localhost:3100/public/images/team/"
  const phase1Team = [
    { name: "Johanna Avila", github: "https://github.com/jobabyyy", image: imageBase + "chris.png" },
    { name: "Taylor Woodson", github: "https://github.com/WoodsonTD", image: imageBase + "twood.png" },
    { name: "Chris Stamper", github: "https://github.com/ZeroDayPoke", image: imageBase + "jobb.png" },
  ];

  const fullstackTeam = [
    { name: "Katrina Keas", github: "https://github.com/kkeas", image: imageBase + "kat.png" },
    { name: "Taylor Woodson", github: "https://github.com/WoodsonTD", image: imageBase + "twood.png" },
    { name: "Chris Stamper", github: "https://github.com/ZeroDayPoke", image: imageBase + "chris.png" },
    { name: "Heather Hayes", github: "https://github.com/hayes28", image: imageBase + "hazy.png" },
    { name: "Evan Richardson", github: "https://github.com/evanrich2404", image: imageBase + "evan.png" },
  ];

  const machineLearningTeam = [
    { name: "Mason Counts", github: "https://github.com/spindouken", image: imageBase + "mason.png" },
    { name: "Johanna Avila", github: "https://github.com/jobabyyy", image: imageBase + "jobb.png" },
    { name: "Chris Stamper", github: "https://github.com/ZeroDayPoke", image: imageBase + "chris.png" },
  ];

  const renderTeam = (team, title) => (
    <div>
      <h3>{title}</h3>
      <div className="row">
        {team.map((member, index) => (
          <div className="col-md-4" key={index}>
            <Card style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={member.image}
                className="img-fluid rounded-circle mb-3"
              />
              <Card.Body>
                <Card.Title className="text-success">{member.name}</Card.Title>
                <Card.Text>We have no titles currently</Card.Text>
                <Button
                  variant="outline-success"
                  size="sm"
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Phase 1 Team</h2>
      {renderTeam(phase1Team)}
      <h2>Phase 2 Team</h2>
      {renderTeam(fullstackTeam, "Fullstack")}
      {renderTeam(machineLearningTeam, "Machine Learning")}
    </div>
  );
};

export default About;
