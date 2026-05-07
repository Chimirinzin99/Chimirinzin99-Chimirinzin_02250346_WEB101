import './App.css';
import ProfileCard from './components/ProfileCard';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Team Profiles</h1>
      </header>

      <div className="profiles-container">
        <ProfileCard
          name="Alice Johnson"
          role="Frontend Developer"
          avatar="https://via.placeholder.com/100"
          skills={["React", "CSS", "JavaScript"]}
        />
        <ProfileCard
          name="Bob Smith"
          role="UI/UX Designer"
          avatar="https://via.placeholder.com/100"
          skills={["Figma", "Photoshop", "Wireframing"]}
        />
        <ProfileCard
          name="Carol White"
          role="Backend Developer"
          avatar="https://via.placeholder.com/100"
          skills={["Node.js", "Python", "MongoDB"]}
        />
      </div>
    </div>
  );
}

export default App;