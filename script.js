const NOTION_DATABASE_ID = '7b050bafa16e4fabb6de7d502e8c5bcd';
const NOTION_API_KEY = 'secret_UbCe5e7QwrpK8fadwOHDxBa1ydcY0HFy32kfUFyUKaD';

let spinning = false;
const displayedItem = document.getElementById('displayedItem');

async function fetchNotionDatabase() {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // You can customize the query as needed
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Notion API');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function spinWheel() {
  const notionDatabase = await fetchNotionDatabase();
  if (notionDatabase.length === 0) {
    alert('No items found in the Notion database');
    return;
  }

  const randomIndex = Math.floor(Math.random() * notionDatabase.length);
  displayedItem.textContent = notionDatabase[randomIndex].properties.Name.title[0].text.content;
}

function startSpinning() {
  if (!spinning) {
    spinning = true;
    const spinInterval = 100; // Adjust this value for faster or slower spinning
    const spinDuration = 2000; // Adjust this value for longer or shorter spinning time

    let spinCount = 0;
    const totalSpins = 20; // Adjust this value to control the number of spins

    function spin() {
      spinWheel();
      spinCount++;

      if (spinCount < totalSpins) {
        setTimeout(spin, spinInterval);
      } else {
        spinning = false;
        alert('Congratulations! You won: ' + displayedItem.textContent);
      }
    }

    setTimeout(spin, spinDuration);
  }
}

// Add the event listener for the button click
document.querySelector('button').addEventListener('click', startSpinning);
