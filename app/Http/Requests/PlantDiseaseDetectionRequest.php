<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlantDiseaseDetectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Can be restricted later with policies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:10240', // 10MB max
            ],
            'plant_name' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Please upload an image of the plant.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, jpg, png, gif, or webp.',
            'image.max' => 'The image size must not exceed 10MB.',
        ];
    }
}

