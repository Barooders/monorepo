import { TransactionBaseService } from '@medusajs/medusa';
import { EntityManager, IsNull, Not } from 'typeorm';
import { OnboardingState } from '../models/onboarding';
import OnboardingRepository from '../repositories/onboarding';
import { UpdateOnboardingStateInput } from '../types/onboarding';

type InjectedDependencies = {
  manager: EntityManager;
  onboardingRepository: typeof OnboardingRepository;
};

class OnboardingService extends TransactionBaseService {
  protected onboardingRepository_: typeof OnboardingRepository;

  constructor({ onboardingRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.onboardingRepository_ = onboardingRepository;
  }

  async retrieve(): Promise<OnboardingState | null> {
    const onboardingRepo = this.activeManager_.withRepository(
      this.onboardingRepository_,
    );

    const status = await onboardingRepo.findOne({
      where: { id: Not(IsNull()) },
    });

    return status;
  }

  async update(data: UpdateOnboardingStateInput): Promise<OnboardingState> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const onboardingRepository = transactionManager.withRepository(
          this.onboardingRepository_,
        );

        const status = await this.retrieve();

        if (status === null) {
          throw new Error('No onboarding status found');
        }

        for (const [key, value] of Object.entries(data)) {
          status[key] = value;
        }

        return await onboardingRepository.save(status);
      },
    );
  }
}

export default OnboardingService;
