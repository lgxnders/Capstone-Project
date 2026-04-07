import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchResourceById } from "../services/api";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function ResourceDetailsPage() {
  const { id } = useParams(); 
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getResource = async () => {
      try {
        const data = await fetchResourceById(id);
        setResource(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getResource();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  if (!resource) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
      <Header />
      
      <main style={{ flex: 1, maxWidth: '800px', margin: '40px auto', padding: '32px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '90%' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>&larr; Back</Link>
        
        <h1 style={{ marginTop: '24px', color: '#1f2937' }}>{resource.title}</h1>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', textTransform: 'capitalize' }}>
            {resource.type}
          </span>
          {resource.timeEstimate && (
            <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500' }}>
              {resource.timeEstimate} min read
            </span>
          )}
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4b5563', marginBottom: '32px' }}>
          {resource.description}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
          >
            Visit Resource
          </a>

          {/* button for the bookmark implementation */}
          <button 
            style={{ padding: '12px 24px', border: '2px solid #e5e7eb', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#4b5563', transition: 'border-color 0.2s' }}
            onMouseOver={(e) => e.target.style.borderColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.borderColor = '#e5e7eb'}
            onClick={() => alert("Bookmark implementation pending")}
          >
            Bookmark / Favorite
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}