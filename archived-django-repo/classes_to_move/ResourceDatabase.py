from typing import List
from .types import Resource


class ResourceDatabase:
	def __init__(self):
		self.resources: List[Resource] = [] #populate by querying db model

	def search_resources(self, criteria: SearchCriteria) -> List[Resource]:
        """Performs a complex search based on criteria (keywords, etc.)."""
        print(f"Searching resources with keywords: {criteria.keywords}")
        return self.resources[:criteria.max_results]