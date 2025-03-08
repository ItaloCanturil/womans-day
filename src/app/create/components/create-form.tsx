"use client"

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabaseService } from "@/db/supabase";

const createFormSchema = z.object({
	email: z.string().email({ message: "Email inválido" }),
	message: z.string(),
	women_name: z.string(),
	photo_url: z.array(
		z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
			message: "File size must be less than 4MB",
		}),
	).max(3),
});

type FormSchema = z.infer<typeof createFormSchema>;

export default function CreateForm() {
	const router = useRouter();

	const dropZoneConfig = {
		maxFiles: 3,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};

	const form = useForm<FormSchema>({
		resolver: zodResolver(createFormSchema),
	});

	const onSubmit = async (data) => {
		try {
			const photo_urls: string[] = [];

			for (const file of data.photo_url) {
				const { data, error } = await supabaseService.storage
					.from('imagens-homenagens')
					.upload(`public/${Date.now()}-${file.name}`, file, {
						cacheControl: '3600',
						upsert: false
					});

				if (error) throw error;
				const publicUrl = supabaseService.storage
        .from('imagens-homenagens')
        .getPublicUrl(data.path).data.publicUrl;

				photo_urls.push(publicUrl);
			}

			const formData = {
				women_name: data.women_name,
				email: data.email,
				message: data.message,
				photo_urls: photo_urls
			}
			console.log("🚀 ~ onSubmit ~ formData:", formData)
			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
	
			if (!response.ok) throw new Error('Erro ao enviar formulário');
	
			const responseData = await response.json();
			router.push(`/confirmacao?page_id=${responseData.page_id}`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col justify-center max-w-2xl px-4 gap-2"
			>
				<FormField
					control={form.control}
					name="women_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input
									placeholder="Adicione o nome de uma mulher especial"
									value={field.value}
									onChange={e => field.onChange(e)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="Adicione email"
									value={field.value}
									onChange={e => field.onChange(e)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mensagem</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Placeholder"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="photo_url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Selecione as fotos</FormLabel>
							<FormControl>
								<FileUploader
									value={field.value}
									onValueChange={field.onChange}
									dropzoneOptions={dropZoneConfig}
									className="relative bg-background rounded-lg p-2"
								>
									<FileInput
										id="fileInput"
										className="outline-dashed outline-1 outline-slate-500"
									>
										<div className="flex items-center justify-center flex-col p-8 w-full ">
											<CloudUpload className="text-gray-500 w-10 h-10" />
											<p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
												<span className="font-semibold">Click to upload</span>
												&nbsp; or drag and drop
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												SVG, PNG, JPG or GIF
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{field.value &&
											field.value.length > 0 &&
											field.value.map((file, i) => (
												<FileUploaderItem key={i} index={i}>
													<Paperclip className="h-4 w-4 stroke-current" />
													<span>{file.name}</span>
												</FileUploaderItem>
											))}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Criar</Button>
			</form>
		</Form>
	);
}
