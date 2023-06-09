import React, { useEffect, useState } from 'react';
import Button from '../../components/buttons/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function NewProduct() {

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [productName, setProductName] = useState('')
    const [cId, setCId] = useState(1)
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)

    const handleChangeProductName = (e) => {
        setProductName(e.target.value)
    }
    const handleChangeCategory = (e) => {
        setCId(e.target.value)
    }
    const handleChangePrice = (e) => {
        setPrice(e.target.value)
    }
    const handleChangeDescription = (e) => {
        setDescription(e.target.value)
    }
    const handleChangeFile = (e) => {
        setFile(e.target.files[0]) 
    }

    const handleSubmitNewProduct = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append('name', productName)
        formData.append('file', file)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('categoryId', cId)

        try {
            const response = await axios.post('https://api.mybebe.net/api/v1/mall/item', formData ,{
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("성공")
        } catch (error) {
            console.log(error)
        }
    }

    const [categories, setCategories] = useState([])

    useEffect(() => {
        if(isLoggedIn){
            getCategory()
        }
    }, [isLoggedIn])

    const getCategory = async () => {
        try {
            const response = await axios.get('https://api.mybebe.net/api/v1/mall/category',{
                headers : {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            console.log(response.data)
            setCategories(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='w-full text-center'>
            <h2 className='text-2xl font-bold my-4'>새로운 제품 등록</h2>
            { file && ( 
                <img 
                    className='w-96 mx-auto mb-2' 
                    src={URL.createObjectURL(file)} 
                    alt='file' 
                />
            )}
            <form className='flex flex-col p-12' onSubmit={handleSubmitNewProduct}>
                <input 
                    type="file" 
                    accept='image/*' 
                    name='file' 
                    required 
                    onChange={handleChangeFile} 
                />
                <input 
                    type='text' 
                    name='name' 
                    value={productName || ''} 
                    placeholder='제품명' 
                    required 
                    onChange={handleChangeProductName}/> 
                <input 
                    type='number' 
                    name='price' 
                    value={price || ''} 
                    placeholder='가격' 
                    required 
                    onChange={handleChangePrice}
                />
                <div className='p-4 outline-none border border-gray-300 my-1 text-left'>
                    <label className='text-gray-400' >
                        카테고리</label>
                        <select className='ml-3 text-center' onChange={handleChangeCategory} value={cId} >
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    
                </div>
                <input 
                    type='text' 
                    name='description' 
                    value={description || ''} 
                    placeholder='제품 설명' 
                    required 
                    onChange={handleChangeDescription}
                />
                <Button text='제품 등록하기'  />
            </form>
        </section>
    );
}

// text={isUploading ? '업로드 중 ..' : '제품 등록하기'} disabled={isUploading}