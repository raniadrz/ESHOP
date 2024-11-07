import { useNavigate } from "react-router";
import './Category.css'; // Import the CSS file

// category
const category = [
    {
        icon: '🐕',
        name: 'Dog',
        
    },
    {
        icon: '🐱',
        name: 'Cat',
        
    },
    {
        icon: '🦜',
        name: 'Bird',
       
    },
    {
        icon: '🐠',
        name: 'Fish',
        
    },
    {
        icon: '🐹',
        name: 'Little Pet',
        
    },
    {
        icon: '🦎',
        name: 'Reptile',
        
    }
];

const Category = () => {
    // navigate
    const navigate = useNavigate();
    return (
        <div className="category-container">
            <h2 className="category-title">Categories</h2>
            <div className="category-grid">
                {category.map((item, index) => (
                    <div 
                        key={index} 
                        className="category-card"
                        onClick={() => navigate(`/category/${item.name}`)}
                    >
                        <div className="category-icon">{item.icon}</div>
                        <div className="category-info">
                            <h3 className="category-name">{item.name}</h3>
                            <span className="category-threads">{item.threads}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
