import Seo from '@/shared/components/Seo'
import PlaceAdPage from '@/widgets/plates/PlaceAdForm'
import React, { useState } from 'react'

const SellNumber = () => {
	const [plate, setPlate] = useState<{ text: string; region: string }>({
  text: "A777AA",
  region: "77",
});
	return (
		<>
			<Seo title="Знак отличия" description="Главная страница каркаса SPA" />
			<div>
				<PlaceAdPage/>
			</div>
		</>
	)
}

export default SellNumber