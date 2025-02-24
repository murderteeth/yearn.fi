import {AnimatePresence, motion} from 'framer-motion';
import Meta from '@common/components/Meta';
import {useCurrentApp} from '@common/hooks/useCurrentApp';
import {variants} from '@common/utils/animations';
import {YBalContextApp} from '@yBal/contexts/useYBal';

import type {NextRouter} from 'next/router';
import type {ReactElement} from 'react';

export function Wrapper({children, router}: {children: ReactElement; router: NextRouter}): ReactElement {
	const {manifest} = useCurrentApp(router);

	return (
		<div className={'mx-auto my-0 max-w-6xl pt-4 md:mb-0 md:mt-16'}>
			<Meta meta={manifest} />
			<YBalContextApp>
				<AnimatePresence mode={'wait'}>
					<motion.div
						key={router.asPath}
						initial={'initial'}
						animate={'enter'}
						exit={'exit'}
						className={'my-0 h-full md:mb-0 md:mt-16'}
						variants={variants}>
						{children}
					</motion.div>
				</AnimatePresence>
			</YBalContextApp>
		</div>
	);
}
