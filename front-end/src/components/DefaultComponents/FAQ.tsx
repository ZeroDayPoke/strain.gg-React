import { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";

const FAQPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      question: "What is the Machine Learning Initiative?",
      answer:
        "Our Machine Learning Initiative is a project that uses advanced algorithms to predict which strains of cannabis you might find most appealing based on your preferences and feedback. The more you participate, the better our predictions become, helping you discover new favorites and enjoy a more personalized experience on our platform.",
    },
    {
      question: "How is my data kept private?",
      answer:
        "We do not include any personally identifiable information in our model. The data used in this initiative includes only product reviews, ratings, and strain characteristics. Your participation in this initiative is entirely voluntary and you can choose to opt-out at any time.",
    },
    {
      question: "How can I participate?",
      answer:
        "Participation is simple. All you need to do is continue using Strain.gg as you normally would - search for products, leave reviews, and rate the strains you try. Each review and rating you leave helps our model learn more about your preferences and improves its predictions.",
    },
    {
      question: "Why should I participate?",
      answer:
        "By participating in this initiative, you're not only improving your own experience but also contributing to the broader cannabis community. Your input helps us create a smarter platform that can provide more accurate recommendations for all users. Plus, you might discover new strains that you wouldn't have tried otherwise!",
    },
  ];

  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <Card.Body>
        <Card.Title>FAQs</Card.Title>
        <ListGroup variant="flush">
          {faqs.map((faq, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => setActiveQuestion(index)}
            >
              {faq.question}
              {activeQuestion === index && (
                <Card.Text className="mt-2">{faq.answer}</Card.Text>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default FAQPage;
