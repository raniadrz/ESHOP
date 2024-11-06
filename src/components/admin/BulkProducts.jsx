import { addDoc, collection, Timestamp } from 'firebase/firestore';
import Papa from 'papaparse';
import React, { useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import CustomToast from '../../components/CustomToast/CustomToast';
import myContext from '../../context/myContext';
import { fireDB } from '../../firebase/FirebaseConfig';
import Loader from '../loader/Loader';

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const showCustomToast = (type, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          type={type}
          message={message}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 1500,
        position: 'bottom-center',
        id: `${type}-${Date.now()}`,
      }
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      showCustomToast('error', 'Please select a valid CSV file');
      setFile(null);
    }
  };

  const processAndUploadProducts = async (results) => {
    const productsRef = collection(fireDB, 'products');
    let successCount = 0;
    let errorCount = 0;
  
    for (const row of results.data) {
      // Skip empty rows
      if (!row.title || !row.code) continue;
  
      try {
        // Validate and sanitize the data
        const productData = {
          title: row.title?.trim() || '',
          code: row.code?.trim() || '',
          price: row.price?.toString() || '0',
          stock: parseInt(row.stock) || 0,
          productImageUrl: row.productImageUrl?.trim() || '',
          category: row.category?.trim() || '',
          category2: row.category2?.trim() || '',
          subcategory: row.subcategory?.trim() || '',
          description: row.description?.trim() || '',
          productType: row.productType?.trim() || 'New Product',
          status: true,
          time: Timestamp.now(),
          date: new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
        };
  
        // Validate required fields
        if (!productData.title || !productData.code || !productData.category) {
          console.error('Missing required fields for row:', row);
          errorCount++;
          continue;
        }
  
        await addDoc(productsRef, productData);
        successCount++;
      } catch (error) {
        console.error('Error uploading product:', error);
        errorCount++;
      }
    }
  
    return { successCount, errorCount };
  };

  const handleUpload = () => {
    if (!file) {
      showCustomToast('error', 'Please select a CSV file first');
      return;
    }

    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { successCount, errorCount } = await processAndUploadProducts(results);
          
          if (successCount > 0) {
            showCustomToast('success', `Successfully uploaded ${successCount} products`);
            if (errorCount > 0) {
              showCustomToast('warning', `Failed to upload ${errorCount} products`);
            }
            setTimeout(() => navigate('/admin-dashboard'), 2000);
          } else {
            showCustomToast('error', 'No products were uploaded');
          }
        } catch (error) {
          console.error('Upload error:', error);
          showCustomToast('error', 'Failed to process file');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('Parsing error:', error);
        showCustomToast('error', 'Failed to parse CSV file');
        setLoading(false);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'title',
      'code',
      'price',
      'stock',
      'productImageUrl',
      'category',
      'category2',
      'subcategory',
      'description',
      'productType'
    ];
    
    // Add a sample row
    const sampleRow = [
      'Sample Product',
      'PROD001',
      '19.99',
      '100',
      'https://example.com/image.jpg',
      'Dog',
      'Τροφές Σκύλου',
      'Ξηρά τροφή',
      'Product description here',
      'New Product'
    ];
    
    const csvContent = 
      headers.join(',') + '\n' + 
      sampleRow.join(',') + '\n';
      
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <div style={{
      backgroundImage: `url(https://t3.ftcdn.net/jpg/04/81/85/46/360_F_481854656_gHGTnBscKXpFEgVTwAT4DL4NXXNhDKU9.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <Toaster position="bottom-center" toastOptions={{ duration: 1500 }} />
      {loading && <Loader />}
      {!loading && (
        <Segment style={{ maxWidth: '600px', width: '100%' }}>
          <Grid columns={2} style={{ marginBottom: '1rem' }}>
            <Grid.Column>
              <Header as="h2" color="blue">
                Bulk Upload Products
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button
                as={Link}
                to="/add/product"
                color="blue"
                size="small"
              >
                Single Upload
              </Button>
            </Grid.Column>
          </Grid>

          <Message info>
            <Message.Header>CSV File Requirements</Message.Header>
            <p>Required fields:</p>
            <ul>
              <li><strong>title:</strong> Product name</li>
              <li><strong>code:</strong> Unique product code</li>
              <li><strong>category:</strong> Main category</li>
            </ul>
            <p>Optional fields:</p>
            <ul>
              <li>price, stock, productImageUrl, category2, subcategory, description, productType</li>
            </ul>
            <p>Download the template for the correct format.</p>
          </Message>

          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Button
                icon
                labelPosition="left"
                onClick={handleDownloadTemplate}
                type="button"
                color="green"
              >
                <Icon name="download" />
                Download Template
              </Button>
            </Form.Field>

            <Form.Field>
              <label>Upload CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Form.Field>

            {uploadStatus && (
              <Message
                positive={uploadStatus.includes('Success')}
                negative={uploadStatus.includes('Error')}
              >
                {uploadStatus}
              </Message>
            )}

            <Button.Group fluid>
              <Button
                onClick={() => navigate('/admin-dashboard')}
                type="button"
                secondary
              >
                Cancel
              </Button>
              <Button
                type="submit"
                primary
                disabled={!file}
              >
                Upload Products
              </Button>
            </Button.Group>
          </Form>
        </Segment>
      )}
    </div>
  );
};

export default BulkUploadPage;